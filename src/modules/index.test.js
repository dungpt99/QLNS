const chai = require('chai')
const fs = require('fs')
const chaiHttp = require('chai-http')
const server = 'http://localhost:3000'

chai.should()
chai.use(chaiHttp)

const defaultUser = {
  username: 'admin',
  password: '123456',
}

let token
describe('Test API', () => {
  before((done) => {
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

  after((done) => {
    chai
      .request(server)
      .post('/logout')
      .set({ Authorization: `Bearer ${token}` })
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })

  describe('Test API user', () => {
    /**
     * Test POST user
     */
    describe('POST API /users', () => {
      // it('It should post user', (done) => {
      //   chai
      //     .request(server)
      //     .post('/users')
      //     .field('fname', 'Dung')
      //     .field('lname', 'Phung')
      //     .field('username', 'dung123')
      //     .field('password', '123456')
      //     .field('email', 'dungpt1@vmodev.com')
      //     .field('address', 'HNC')
      //     .attach('photo', fs.readFileSync(`${process.cwd()}/public/images/2.jpg`), '2.jpg')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .end((err, res) => {
      //       res.should.have.status(200)
      //       done()
      //     })
      // })

      it('It should not POST users', (done) => {
        chai
          .request(server)
          .post('/users')
          .field('fname', 'Dung')
          .field('lname', 'Phung')
          .attach('photo', fs.readFileSync(`${process.cwd()}/public/images/2.jpg`), '2.jpg')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(400)
            done()
          })
      })
    })

    /**
     * Test get listUser
     */
    describe('GET API /users', () => {
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
        const userId = 'b7974141-aa38-460b-b9c4-60c8102dddf2'
        chai
          .request(server)
          .put(`/users/${userId}`)
          .set({ Authorization: `Bearer ${token}` })
          .field('fname', 'Dung')
          .field('lname', 'Phung')
          .field('address', 'HNC')
          .attach('photo', fs.readFileSync(`${process.cwd()}/public/images/2.jpg`), '2.jpg')
          .end((err, response) => {
            response.should.have.status(200)
            done()
          })
      })

      it('It should not PUT  user', (done) => {
        const userId = 'b7974141-aa38-460b-b9c4-60c8102dddf2'
        chai
          .request(server)
          .put(`/users/${userId}`)
          .set({ Authorization: `Bearer ${token}` })
          .attach('photo', fs.readFileSync(`${process.cwd()}/public/images/2.jpg`), '2.jpg')
          .end((err, response) => {
            response.should.have.status(400)
            done()
          })
      })
    })

    /**
     * Test delete user by id
     */
    describe('DELETE API /users/:id', () => {
      // it('It should  DELETE  user', async (done) => {
      //   const user = await users.findOne({
      //     where: {
      //       username: 'dung123',
      //     },
      //   })
      //   chai
      //     .request(server)
      //     .delete(`/users/${user.id}`)
      //     .set({ Authorization: `Bearer ${token}` })
      //     .end((err, response) => {
      //       response.should.have.status(200)
      //       done()
      //     })
      // })

      it('It should not DELETE  user', (done) => {
        const userId = 'b7974141-aa38-460b-b9c4-60c8102dddf'
        chai
          .request(server)
          .delete(`/users/${userId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })
  })

  describe('Test API role', () => {
    /**
     * Test POST role
     */
    describe('POST API /roles', () => {
      // it('It should post role', (done) => {
      //   const role = {
      //     username: 'Director',
      //     role: 'Admin',
      //     read: {
      //       action: 'READ',
      //       checkAction: true,
      //     },
      //     write: {
      //       action: 'READ',
      //       checkAction: true,
      //     },
      //     update: {
      //       action: 'READ',
      //       checkAction: true,
      //     },
      //     del: {
      //       action: 'READ',
      //       checkAction: true,
      //     },
      //     approve: {
      //       action: 'READ',
      //       checkAction: true,
      //     },
      //   }
      //   chai
      //     .request(server)
      //     .post('/roles')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .send(role)
      //     .end((err, res) => {
      //       res.should.have.status(200)
      //       done()
      //     })
      // })
      // it('It should not POST users', (done) => {
      //   chai
      //     .request(server)
      //     .post('/user')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .end((err, response) => {
      //       response.should.have.status(404)
      //       done()
      //     })
      // })
    })
    /**
     * Test get listRole
     */
    describe('GET API /roles', () => {
      it('It should get all role', (done) => {
        chai
          .request(server)
          .get('/roles')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET all users', (done) => {
        chai
          .request(server)
          .get('/role')
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
    describe('GET API /roles/:id', () => {
      it('It should get role', (done) => {
        const roleId = '42b25e08-4b6b-4647-9dbb-e51aadd8270f'
        chai
          .request(server)
          .get(`/roles/${roleId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET role', (done) => {
        chai
          .request(server)
          .get('/roles/abc')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })

    /**
     * Test delete user by id
     */
    // describe('DELETE API /roles/:id', () => {
    //   it('It should  DELETE  role', async (done) => {
    //     const roleId = 'f520f285-4d1e-4bfc-847d-9879805ce4d3'
    //     chai
    //       .request(server)
    //       .delete(`/roles/${roleId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(200)
    //         done()
    //       })
    //   })

    //   it('It should not DELETE  role', (done) => {
    //     const userId = 'b7974141-aa38-460b-b9c4-60c8102dddf'
    //     chai
    //       .request(server)
    //       .delete(`/users/${userId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(404)
    //         done()
    //       })
    //   })
    // })
  })

  describe('Test API department', () => {
    /**
     * Test POST department
     */
    describe('POST API /department', () => {
      // it('It should post department', (done) => {
      //   const department = {
      //     name: 'Director',
      //     address: 'Admin',
      //   }
      //   chai
      //     .request(server)
      //     .post('/department')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .send(department)
      //     .end((err, res) => {
      //       res.should.have.status(200)
      //       done()
      //     })
      // })
      // it('It should not POST department', (done) => {
      //   chai
      //     .request(server)
      //     .post('/departments')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .end((err, response) => {
      //       response.should.have.status(404)
      //       done()
      //     })
      // })
    })
    /**
     * Test get listDepartment
     */
    describe('GET API /department', () => {
      it('It should get all department', (done) => {
        chai
          .request(server)
          .get('/department')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET all department', (done) => {
        chai
          .request(server)
          .get('/department/1')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })

    /**
     * Test get department by id
     */
    describe('GET API /department/:id', () => {
      it('It should get department', (done) => {
        const departmentId = 'c3f8e48d-856f-4bf8-a89b-30479f392df3'
        chai
          .request(server)
          .get(`/department/${departmentId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET department', (done) => {
        chai
          .request(server)
          .get('/department/abc')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })

    /**
     * Test delete user by id
     */
    // describe('DELETE API /department/:id', () => {
    //   it('It should  DELETE  department', async (done) => {
    //     const departmentId = '42cd2faf-5341-45b6-b111-4d007eb2e3cc'
    //     chai
    //       .request(server)
    //       .delete(`/department/${departmentId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(200)
    //         done()
    //       })
    //   })

    //   it('It should not DELETE  department', (done) => {
    //     const departmentId = '42cd2faf-5341-45b6-b111-4d007eb2e3c'
    //     chai
    //       .request(server)
    //       .delete(`/department/${departmentId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(404)
    //         done()
    //       })
    //   })
    // })
  })

  describe('Test API form', () => {
    /**
     * Test POST form
     */
    describe('POST API /forms', () => {
      // it('It should post forms', (done) => {
      //   const department = {
      //     content: 'thu viec',
      //     type: 'job',
      //   }
      //   chai
      //     .request(server)
      //     .post('/department')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .send(department)
      //     .end((err, res) => {
      //       res.should.have.status(200)
      //       done()
      //     })
      // })
      // it('It should not POST form', (done) => {
      //   chai
      //     .request(server)
      //     .post('/formss')
      //     .set({ Authorization: `Bearer ${token}` })
      //     .end((err, response) => {
      //       response.should.have.status(404)
      //       done()
      //     })
      // })
    })
    /**
     * Test get listForm
     */
    describe('GET API /forms', () => {
      it('It should get all form', (done) => {
        chai
          .request(server)
          .get('/forms')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET all form', (done) => {
        chai
          .request(server)
          .get('/forms/1')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })

    /**
     * Test get form by id
     */
    describe('GET API /forms/:id', () => {
      it('It should get form', (done) => {
        const formId = 'aebb719e-fa35-43c8-a9a4-49b7b1580567'
        chai
          .request(server)
          .get(`/forms/${formId}`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })

      it('It should not GET form', (done) => {
        chai
          .request(server)
          .get('/form/abc')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(404)
            done()
          })
      })
    })

    // describe('DELETE API /forms/:id', () => {
    //   it('It should  DELETE  form', async (done) => {
    //     const formId = '7ba0197a-8174-4c21-b803-531b25b27190'
    //     chai
    //       .request(server)
    //       .delete(`/department/${formId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(200)
    //         done()
    //       })
    //   })

    //   it('It should not DELETE  form', (done) => {
    //     const formId = '7ba0197a-8174-4c21-b803-531b25b2719'
    //     chai
    //       .request(server)
    //       .delete(`/department/${formId}`)
    //       .set({ Authorization: `Bearer ${token}` })
    //       .end((err, response) => {
    //         response.should.have.status(404)
    //         done()
    //       })
    //   })
    // })
  })

  describe('Test API report', () => {
    /**
     * Test get reportJob
     */
    describe('GET API /reports/job', () => {
      it('It should get all report', (done) => {
        chai
          .request(server)
          .get('/reports/job')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })

    /**
     * Test get reportReview
     */
    describe('GET API /reports/review', () => {
      it('It should get all report', (done) => {
        chai
          .request(server)
          .get('/reports/review')
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(200)
            done()
          })
      })
    })
  })
})
