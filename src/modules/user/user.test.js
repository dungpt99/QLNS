const chai = require('chai')
const chaiHttp = require('chai-http')

const server = require(`${process.cwd()}/app.js`)

chai.should()
chai.use(chaiHttp)

const defaultUser = {
  username: 'admin',
  password: '123456',
}

let token

describe('Test API user', () => {
  beforeEach((done) => {
    chai
      .request(server)
      .post('/login')
      .send(defaultUser)
      .end((err, res) => {
        token = res.body.accessToken
        res.should.have.status(200)
        done()
      })
  })

  /**
   * Test get listUser
   */
  describe('GET APU /users', () => {
    it('It should get all user', (done) => {
      chai
        .request(server)
        .get('/users')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })

    it('It should not GET all users', (done) => {
      chai
        .request(server)
        .get('/user')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(404)
          done()
        })
    })
  })

  /**
   * Test get user by id
   */
  describe('GET API /users/:id', () => {
    it('It should get user', (done) => {
      const userId = 'b7974141-aa38-460b-b9c4-60c8102dddf2'
      chai
        .request(server)
        .get(`/users/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })

    it('It should not GET user', (done) => {
      chai
        .request(server)
        .get('/users/abc')
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(404)
          done()
        })
    })
  })

  /**
   * Test put user by id
   */
  describe('PUT API /users/:id', () => {
    it('It should  PUT  user', (done) => {
      const userId = 'c9699f18-f039-437b-a6d9-98dd210a7478'
      const user = {
        name: 'user1',
        status: true,
      }
      chai
        .request(server)
        .put(`/users/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, response) => {
          response.should.have.status(200)
          response.body.should.be.a('object')
          response.body.should.have.property('status').eq('Success')
          response.body.should.have.property('message').eq('Update user successfully')
          done()
        })
    })

    it('It should  PUT  user', (done) => {
      const userId = 4
      const user = {
        name: 'user3',
        status: true,
      }
      chai
        .request(server)
        .put(`/users/${userId}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(user)
        .end((err, response) => {
          response.should.have.status(400)
          done()
        })
    })
  })
})
