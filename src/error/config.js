module.exports = {
  400: {
    message: 'Bad request',
    status: 'Fail',
    statusCode: 400,
  },
  Unauthorized: {
    message: 'Unauthorized',
    status: 'Fail',
    statusCode: 401,
  },
  Forbidden: {
    message: 'Forbidden',
    status: 'Fail',
    statusCode: 403,
  },
  notFound: {
    message: 'Not Found',
    status: 'Fail',
    statusCode: 404,
  },
  errorEmail: {
    message: 'Email is not verified',
    status: 'Fail',
    statusCode: 401,
  },
  errId: {
    message: 'Invalid ID',
    status: 'Fail',
    statusCode: 400,
  },
  errUsernamePassword: {
    message: 'Please check email and password',
    status: 'Fail',
    statusCode: 401,
  },
  errExpired: {
    message: 'Form has expired',
    status: 'Fail',
    statusCode: 400,
  },
}
