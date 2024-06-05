export default {
  name: 'comment',
  title: 'Коментарі',
  type: 'document',
  fields: [
    {
      name: 'postedBy',
      title: 'Опубліковано',
      type: 'postedBy',
    },
    {
      name: 'comment',
      title: 'Коментарь',
      type: 'string',
    },
  ],
}
