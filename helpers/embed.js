module.exports = {
    setEmbed : ({title, desc, author, avatar, picture, url}) => {
        return msgEmbed = {
          color: 0xd22140,
          title: title,
          author: {
            name: author,
            icon_url: avatar,
          },
          description: desc,
          thumbnail: {
            url: picture,
          },
          timestamp: new Date(),
      }
    }
}