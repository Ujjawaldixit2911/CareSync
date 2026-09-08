import express from 'express'
import { registerDonor, createBloodRequest, listDonors, listRequests, updateRequestStatus, getBloodStock } from '../controllers/bloodController.js'
import authAdmin from '../middlewares/authAdmin.js'

const bloodRouter = express.Router()

// Admin operations
bloodRouter.post('/update-request-status', authAdmin, updateRequestStatus)
bloodRouter.get('/admin-requests', authAdmin, listRequests)

// Donor & Patient operations
bloodRouter.post('/register', registerDonor)
bloodRouter.post('/request', createBloodRequest)
bloodRouter.get('/list-donors', listDonors)
bloodRouter.get('/list-requests', listRequests)
bloodRouter.get('/stock', getBloodStock)

export default bloodRouter
