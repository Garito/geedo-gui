export default {
  properties: {
    name: { type: 'string', 'x-label': 'Name', title: 'This is how other users will identify you' },
    type: {
      type: 'string',
      Enum: [
        { label: 'Type 1', value: 'type-1' },
        { label: 'Type 2', value: 'type-2' },
        { label: 'Type 3', value: 'type-3' },
        { label: 'Type 4', value: 'type-4' },
        { label: 'Type 5', value: 'type-5' },
        { label: 'Type 6', value: 'type-6' },
        { label: 'Type 7', value: 'type-7' },
        { label: 'Type 8', value: 'type-8' },
        { label: 'Type 9', value: 'type-9' },
        { label: 'Type 10', value: 'type-10' }
      ],
      'x-label': 'Type',
      title: 'Select the type'
    },
    shortType: {
      type: 'string',
      Enum: [
        { label: 'Type 1', value: 'type-1' },
        { label: 'Type 2', value: 'type-2' },
        { label: 'Type 3', value: 'type-3' }
      ],
      'x-label': 'Short Type',
      title: 'Select the type'
    },
    date: { type: 'string', format: 'date', 'x-label': 'Date', title: 'Click on the arrow to show the calendar' },
    datetime: {
      type: 'string',
      format: 'date-time',
      'x-label': 'Date & time',
      title: 'Up & down keys change the value under the cursor'
    },
    password: {
      type: 'string', format: 'password', 'x-label': 'Password', title: 'Click the lock to reveal the password'
    },
    file: {
      type: 'string',
      format: 'byte',
      'x-label': 'File',
      title: 'Click to select a file',
      'x-accept': 'image/*',
      'x-multiple': true
    },
    email: { type: 'string', format: 'email', 'x-label': 'Email', 'x-placeholder': 'email@example.com' },
    uuid: { type: 'string', format: 'uuid', 'x-label': 'UUID' },
    number: { type: 'number', 'x-label': 'Number', title: 'Enter a number with decimals' },
    float: { type: 'number', format: 'float', 'x-label': 'Float', 'x-attrs': { icons: { left: 'money-bill' } } },
    double: { type: 'number', format: 'double', 'x-label': 'Double' },
    integer: { type: 'integer', 'x-label': 'Integer', title: 'Enter a number without decimals' },
    int32: { type: 'integer', format: 'int32', 'x-label': 'Int32' },
    int64: { type: 'integer', format: 'int64', 'x-label': 'Int64' },
    boolean: { type: 'boolean', 'x-label': 'Boolean', title: 'Click to toggle' },
    booleanPre: { type: 'boolean', 'x-pre': true },
    array: {
      type: 'array',
      items: { type: 'string' },
      title: 'Select one or more',
      'x-label': 'Array',
      'x-options': {
        'opId': 'Root/get_users',
        'value': 'email',
        'label': 'name'
      }
    },
    object: {
      type: 'object',
      properties: {
        name: { type: 'string' }, amount: { type: 'number', format: 'float' }, price: { type: 'number', format: 'float' }
      },
      required: ['name', 'amount'],
      'x-label': 'Object',
      title: 'Lets see'
    }
  },
  required: ['name', 'type', 'date'],
  type: 'object'
}