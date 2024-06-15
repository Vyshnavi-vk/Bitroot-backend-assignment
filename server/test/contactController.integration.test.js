const mongoose = require('mongoose');
const chai = require('chai');
const supertest = require('supertest');

const app = require('../server');
const Contact = require('../models/contactModel');

const expect = chai.expect;
const request = supertest(app);

(async () => {
    const chaiHttp = await import('chai-http/index.js');
    chai.use(chaiHttp.default);

})();
describe('Contact Controller Integration Tests', function () {

    before((done) => {
        mongoose.connect(process.env.MONGO_URI)
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        mongoose.connection.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    beforeEach((done) => {
        Contact.deleteMany({})
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('POST /api/contact/create', () => {
        it('should create a new contact', async () => {
            const contactData = {
                name: 'John Doe',
                phoneNum: ['77675664767'],
            };

            const res = await request
                .post('/api/contact/create')
                .field('name', contactData.name)
                .field('phoneNum', contactData.phoneNum.join(','))
                .attach('image', 'server/public/assets/home.jpg')

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('msg', 'Contact created successfully');
            expect(res.body.contact).to.have.property('name', 'John Doe');
        });
    });


    describe('GET /api/contact/get-contacts', () => {
        beforeEach(async () => {
            await Contact.deleteMany({});
            await Contact.create({ name: 'John Doe', phoneNum: ['123456789'] });
        });
        it('should get all contacts', async () => {
            const res = await request
                .get('/api/contact/get-contacts')


            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'John Doe');

        });
    });



    describe('DELETE /api/contact/delete/:id', () => {
        let contactId;
        beforeEach(async () => {
            await Contact.deleteMany({});
            const contact = await Contact.create({
                name: 'John Doe',
                phoneNum: ['123456789'],
            });
            contactId = contact._id;
        });
        it('should delete an existing contact', async () => {
            const res = await request
                .delete(`/api/contact/delete/${contactId}`);


            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg', 'Contact deleted successfully');

        });
    });

    describe('GET /api/contact/search', () => {
        beforeEach(async () => {
            await Contact.deleteMany({});
            await Contact.create({ name: 'John Doe', phoneNum: ['123456789'] });
        });
        it('should search for contacts by name or phone number', async () => {
            const res = await request
                .get('/api/contact/search?query=John')

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'John Doe');
        });
    });



    describe('GET /api/contact/export', () => {
        beforeEach(async () => {
            await Contact.deleteMany({});
            await Contact.create({ name: 'John Doe', phoneNum: ['123456789'] });
        });
        it('should get all contacts as CSV', (done) => {
            request
                .get('/api/contact/export')
                .expect('Content-Type', /text\/csv/)
                .end((err, res) => {
                    if (err) {
                        done(err);
                        return;
                    }

                    expect(res).to.have.status(200);
                    expect(res.header['content-type']).to.include('text/csv');

                    done();
                });
        });
    });


})