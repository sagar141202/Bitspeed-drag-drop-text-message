import { Request, Response } from 'express';
import { identifyContact, IdentifyRequest } from '../services/contactService';

/**
 * Identify Controller - Handles the /identify endpoint
 * 
 * Receives POST requests with email and/or phoneNumber
 * Returns consolidated contact information
 */
export async function identifyHandler(req: Request, res: Response) {
  try {
    const { email, phoneNumber } = req.body as IdentifyRequest;

    // Validate request body
    if (email === undefined && phoneNumber === undefined) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Either email or phoneNumber must be provided'
      });
    }

    // Call the service to handle identity reconciliation
    const result = await identifyContact({ email, phoneNumber });

    // Return success response
    return res.status(200).json({
      contact: result
    });

  } catch (error: any) {
    console.error('Error in identify endpoint:', error);
    
    // Return error response
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}
