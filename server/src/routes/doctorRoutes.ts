import { Router } from 'express';
import {
    loginDoctor,
    createDoctor,
    getDoctorById,
    getAllDoctors,
    updateDoctorById,
    deleteDoctorById,
    getDoctorsBySpecialization
  } from '../controllers/doctorController';

const router = Router();

router.post('/login', loginDoctor);
router.post('/create', createDoctor);
router.get('/get/:id', getDoctorById);
router.get('/getAll', getAllDoctors);
router.post('/get/specialization', getDoctorsBySpecialization);
router.put('/update/:id', updateDoctorById);
router.delete('/delete/:id', deleteDoctorById);

export default router;