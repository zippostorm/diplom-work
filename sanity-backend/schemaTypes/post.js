export default {
  name: 'post',
  title: 'Публікації',
  type: 'document',
  fields: [
    {
      name: 'caption',
      title: 'Заголовок',
      type: 'string',
    },
    {
      name: 'video',
      title: 'Публікації',
      type: 'file',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'userId',
      title: 'ID Користувача',
      type: 'string',
    },
    {
      name: 'postedBy',
      title: 'Опубліковано',
      type: 'postedBy',
    },
    {
      name: 'likes',
      title: 'Вподобання',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'user'}],
        },
      ],
    },
    {
      name: 'comments',
      title: 'Коментарі',
      type: 'array',
      of: [{type: 'comment'}],
    },
    {
      name: 'topic',
      title: 'Тег',
      type: 'string',
    },
    {
      name: 'status',
      title: 'Статус',
      type: 'string',
    },
  ],
}
