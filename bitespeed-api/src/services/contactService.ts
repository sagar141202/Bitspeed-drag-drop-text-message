import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Contact Service - Business Logic for Identity Reconciliation
 * 
 * This service handles:
 * 1. Finding existing contacts by email/phone
 * 2. Creating new primary contacts
 * 3. Creating secondary contacts when new info is found
 * 4. Linking two primary contacts when they share info
 * 5. Building consolidated response
 */

export interface IdentifyRequest {
  email?: string | null;
  phoneNumber?: string | null;
}

export interface ConsolidatedContact {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

/**
 * Find contacts matching the given email or phone number
 */
async function findContactsByEmailOrPhone(
  email: string | null | undefined, 
  phoneNumber: string | null | undefined
) {
  return prisma.contact.findMany({
    where: {
      deletedAt: null,
      OR: [
        ...(email ? [{ email }] : []),
        ...(phoneNumber ? [{ phoneNumber }] : [])
      ]
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

/**
 * Find all contacts linked to a primary contact
 */
async function findLinkedContacts(primaryContactId: number) {
  return prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryContactId },
        { linkedId: primaryContactId }
      ],
      deletedAt: null
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

/**
 * Create a new primary contact
 */
async function createPrimaryContact(email: string | null, phoneNumber: string | null) {
  return prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkPrecedence: 'primary'
    }
  });
}

/**
 * Create a new secondary contact linked to a primary contact
 */
async function createSecondaryContact(
  email: string | null, 
  phoneNumber: string | null, 
  primaryContactId: number
) {
  return prisma.contact.create({
    data: {
      email,
      phoneNumber,
      linkedId: primaryContactId,
      linkPrecedence: 'secondary'
    }
  });
}

/**
 * Update a primary contact to become secondary
 */
async function updateToSecondaryContact(contactId: number, newLinkedId: number) {
  return prisma.contact.update({
    where: { id: contactId },
    data: {
      linkedId: newLinkedId,
      linkPrecedence: 'secondary'
    }
  });
}

/**
 * Build consolidated contact response
 */
function buildConsolidatedResponse(contacts: any[]): ConsolidatedContact {
  if (contacts.length === 0) {
    throw new Error('No contacts provided');
  }

  // Find primary contact (first one with linkPrecedence = 'primary' or no linkedId)
  const primaryContact = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
  
  // Collect all emails and phone numbers
  const emails = new Set<string>();
  const phoneNumbers = new Set<string>();
  const secondaryContactIds: number[] = [];

  for (const contact of contacts) {
    if (contact.linkPrecedence === 'secondary') {
      secondaryContactIds.push(contact.id);
    }
    
    if (contact.email) {
      emails.add(contact.email);
    }
    if (contact.phoneNumber) {
      phoneNumbers.add(contact.phoneNumber);
    }
  }

  return {
    primaryContactId: primaryContact.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phoneNumbers),
    secondaryContactIds
  };
}

/**
 * Main identify function - handles identity reconciliation
 * 
 * Algorithm:
 * 1. Find existing contacts with matching email OR phone
 * 2. If no contacts exist -> create new primary contact
 * 3. If contacts exist:
 *    a. Find oldest primary contact
 *    b. Check if incoming data has new information
 *    c. If new info -> create secondary contact
 *    d. If two primaries found -> merge them (older stays primary)
 */
export async function identifyContact(request: IdentifyRequest): Promise<ConsolidatedContact> {
  const { email, phoneNumber } = request;
  
  // Validate: at least one of email or phone should be provided
  if (!email && !phoneNumber) {
    throw new Error('Either email or phoneNumber must be provided');
  }

  // Step 1: Find existing contacts with matching email OR phone
  const existingContacts = await findContactsByEmailOrPhone(email, phoneNumber);

  // Case 1: No existing contacts - create new primary contact
  if (existingContacts.length === 0) {
    const newContact = await createPrimaryContact(email || null, phoneNumber || null);
    return {
      primaryContactId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phoneNumber ? [phoneNumber] : [],
      secondaryContactIds: []
    };
  }

  // Case 2: Contacts exist
  // Find primary contacts (those with linkPrecedence = 'primary')
  const primaryContacts = existingContacts.filter(c => c.linkPrecedence === 'primary');
  
  // Sort by createdAt to find the oldest primary
  primaryContacts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  const oldestPrimary = primaryContacts[0];

  // Check if incoming data has new information not in existing contacts
  const existingEmails = new Set(existingContacts.map(c => c.email).filter(Boolean));
  const existingPhones = new Set(existingContacts.map(c => c.phoneNumber).filter(Boolean));
  
  const hasNewEmail = email && !existingEmails.has(email);
  const hasNewPhone = phoneNumber && !existingPhones.has(phoneNumber);

  // Case 3: Two primary contacts found (need to merge)
  if (primaryContacts.length > 1) {
    // The oldest primary stays as primary
    // All other primaries become secondary
    for (let i = 1; i < primaryContacts.length; i++) {
      await updateToSecondaryContact(primaryContacts[i].id, oldestPrimary.id);
    }
  }

  // Case 4: New information found - create secondary contact
  if (hasNewEmail || hasNewPhone) {
    await createSecondaryContact(
      email || null, 
      phoneNumber || null, 
      oldestPrimary.id
    );
  }

  // Get all linked contacts and build response
  const allContacts = await findLinkedContacts(oldestPrimary.id);
  return buildConsolidatedResponse(allContacts);
}

export default prisma;
