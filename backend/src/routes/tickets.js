import express from 'express';
import {
  getAllTicketRequests,
  getTicketRequestsByEvent,
  createTicketRequest,
  getTicketRequestCount
} from '../controllers/ticketController.js';

const router = express.Router();

router.get('/', getAllTicketRequests);
router.get('/event/:eventId', getTicketRequestsByEvent);
router.get('/event/:eventId/count', getTicketRequestCount);
router.post('/', createTicketRequest);

export default router;
