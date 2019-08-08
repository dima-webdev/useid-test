export default {
  taskname: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  },
  keyWords: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 1024
    }
  },
};
