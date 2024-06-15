const Contact = require('../models/contactModel')
const { createContactController, fetchContactsController, updateContactController, deleteContactController, searchContactController, exportToCSVController } = require('../controllers/contactController')
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect


chai.use(require('sinon-chai'))

describe('Contact Controller', () => {
    describe('Create Controller', () => {
        it('Should create a new Contact', async () => {
            const req = {
                body: { name: 'Eric Dew', phoneNum: ['123456799', '987344410'] },
                file: { filename: 'home.png' }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            sinon.stub(Contact, 'findOne').resolves(null)
            sinon.stub(Contact.prototype, 'save').resolves({ _id: '1', name: "Eric Dew", phoneNum: ['123456799', '987344410'], image: 'home.jpg' })
            await createContactController(req, res)

            expect(res.status).to.have.been.calledWith(201)
            expect(res.json).to.have.been.calledWith(sinon.match({ msg: "Contact created successfully" }))
            Contact.findOne.restore()
            Contact.prototype.save.restore()
        })

        it('Should not create a contact phone number already exists', async () => {
            const req = {
                body: { name: "Ritu", phoneNum: ['987344410', '0823340383'] },
                file: { filename: 'card.jpg' }
            }

            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub()
            }

            sinon.stub(Contact, 'findOne').resolves({ _id: 2, name: "Ritu", phoneNum: ['987344410', '0823340383'], image: 'card.jpg' })
            await createContactController(req, res)

            expect(res.status).to.have.been.calledWith(400)
            expect(res.json).to.have.been.calledWith(sinon.match({ msg: "One or more phone numbers are already taken" }))
            Contact.findOne.restore()
        })
    })

    describe('Fetch All Contacts', () => {
        it('Should fetch all Contacts', async () => {
            const req = {}
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() }

            sinon.stub(Contact, 'find').resolves([{ _id: '1', name: "Kate", phoneNum: ['9473848574', '3938483970'] }])

            await fetchContactsController(req, res)

            expect(res.status).to.have.been.calledWith(200)
            expect(res.json).to.have.been.calledWith(sinon.match.array)

            Contact.find.restore()
        })
    })

    describe('Update Contact', () => {
        it('Should update an existing Contact', async () => {
            const req = {
                params: { id: '1' },
                body: { name: 'Lilly', phoneNum: ['232949347', '9485847883'] },
                file: { filename: 'card.jpg' }
            }

            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() }

            sinon.stub(Contact, 'findById').resolves({ _id: '1', name: "Rosy", phoneNum: ['867564538', '0765124557'] })
            sinon.stub(Contact, 'findOne').resolves(null)
            sinon.stub(Contact, 'findByIdAndUpdate').resolves({ _id: '1', name: 'Dr Lilly', phoneNum: ['938493988', '37487485'], image: 'logo.jpg' })

            await updateContactController(req, res)

            expect(res.status).to.have.been.calledWith(200)
            expect(res.json).to.have.been.calledWith(sinon.match({ msg: "Contact updated successfully" }))

            Contact.findById.restore()
            Contact.findOne.restore()
            Contact.findByIdAndUpdate.restore()
        })
    })

    describe('Delete Contact', () => {
        it('Should delete an existing Contact', async () => {
            const req = { params: { id: '1' } }
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() }

            sinon.stub(Contact, 'findByIdAndDelete').resolves({ _id: '1', name: 'Dr Lilly', phoneNum: ['938493988', '37487485'] })

            await deleteContactController(req, res)

            expect(res.status).to.have.been.calledWith(200)
            expect(res.json).to.have.been.calledWith(sinon.match({ msg: "Contact deleted successfully" }))

            Contact.findByIdAndDelete.restore()
        })
    })

    describe('Search Contact', () => {
        it('Should search for contacts by name or phone number', async () => {
            const req = { query: { query: 'John' } }
            const res = { status: sinon.stub().returnsThis(), json: sinon.stub() }

            sinon.stub(Contact, 'find').resolves([{ _id: '1', name: 'John', phoneNum: ['8374374383'] }])

            await searchContactController(req, res)

            expect(res.status).to.have.been.calledWith(200)
            expect(res.json).to.have.been.calledWith(sinon.match.array)

            Contact.find.restore()
        })
    })

    describe('Export Contacts To CSV Controller', () => {
        it('Should export contacts to CSV', async () => {
            const req = {}
            const res = {
                header: sinon.stub().returnsThis(),
                attachment: sinon.stub().returnsThis(),
                send: sinon.stub()
            }

            sinon.stub(Contact, 'find').resolves([{ name: 'John', phoneNum: ['4565767678', '4458478889'], image: 'card.jpg' }])

            await exportToCSVController(req, res)

            expect(res.header).to.have.been.calledWith('Content-Type', 'text/csv')
            expect(res.attachment).to.have.been.calledWith('contacts.csv')
            expect(res.send).to.have.been.calledWith(sinon.match.string)

            Contact.find.restore()
        })
    })

})