import Service from '../models/Service.js';

// @desc    Get all services for the logged-in faculty
// @route   GET /api/services/my-services
export const getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ faculty: req.user._id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new service
// @route   POST /api/services
export const createService = async (req, res) => {
    try {
        const { title, description, price, currency } = req.body;

        const service = new Service({
            title,
            description,
            price,
            currency,
            faculty: req.user._id, // Link to the logged-in faculty
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: 'Invalid service data', details: error.message });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
export const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Ensure the logged-in user is the owner of the service
        if (service.faculty.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this service' });
        }

        await service.deleteOne();
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getServicesByFacultyId = async (req, res) => {
    try {
        const services = await Service.find({ faculty: req.params.facultyId });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};