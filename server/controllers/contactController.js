const Contact = require('../models/contactModel');

const createContactController = async (req, res) => {

    const { name, phoneNum, image } = req.body;

    try {
        const existingContact = await Contact.findOne({
            phoneNum: { $elemMatch: { $in: phoneNum } }
        });

        if (existingContact) {
            res.status(400).json({ msg: "One or more phone numbers are already taken" });
        } else {
            const newContact = new Contact({ name, phoneNum, image: req.file.filename });
            const savedContact = await newContact.save();
            res.status(201).json({ msg: "Contact created successfully", contact: savedContact });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

const fetchContactsController = async (req, res) => {
    try {
        const contacts = await Contact.find({})
        res.status(200).json(contacts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const updateContactController = async (req, res) => {
    const { id } = req.params
    const { name, phoneNum, image } = req.body
    try {

        const currentContact = await Contact.findById(id);

        let phoneNumbersToCheck = phoneNum;
        if (currentContact) {
            phoneNumbersToCheck = phoneNum.filter(num => !currentContact.phoneNum.includes(num));
        }

        const existingContact = await Contact.findOne({
            phoneNum: { $elemMatch: { $in: phoneNumbersToCheck } }
        });
        if (existingContact) {
            res.status(400).json({ msg: "One or more phone numbers are already taken" });
        } else {
            const contact = await Contact.findByIdAndUpdate(
                id,
                { name, phoneNum, image: req.file.filename },
                { new: true }
            )
            res.status(200).json({ msg: "Contact updated successfully" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const deleteContactController = async (req, res) => {
    const { id } = req.params
    try {
        const contact = await Contact.findByIdAndDelete(id)
        res.status(200).json({ msg: "Contact deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const searchContactController = async (req, res) => {
    const { query } = req.query
    try {
        const contacts = await Contact.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { phoneNum: { $elemMatch: { $regex: query, $options: 'i' } } }
            ]
        });

        res.status(200).json(contacts);
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const exportToCSVController = async (req, res) => {
    try {
        const contacts = await Contact.find()

        const fields = ['name', 'phoneNum', 'image'];
        const csvHeader = fields.join(', ');
        const csvRows = contacts.map(contact => {
            return `${contact.name}, ${contact.phoneNum}, ${contact.image}`;
        });
        const csvData = [csvHeader, ...csvRows].join('\n');


        res.header('Content-Type', 'text/csv')
        res.attachment('contacts.csv')
        res.send(csvData)

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}





module.exports = {
    createContactController,
    fetchContactsController,
    updateContactController,
    deleteContactController,
    searchContactController,
    exportToCSVController
};
