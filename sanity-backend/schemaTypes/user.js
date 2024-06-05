export default {
  name: 'user',
  title: 'Користувачі',
  type: 'document',
  fields: [
    {
      name: 'userName',
      title: 'Імʼя користувача',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Аватар',
      type: 'string',
    },
    {
      name: 'userType',
      title: 'Тип користувача',
      type: 'string',
      options: {
        list: ['user', 'admin', 'moderator'],
      },
    },
  ],
}
