const MessageItem = ({ message }) => {
  return (
    <div className="mb-2">
      <b>
        {message.username}
        :
      </b>
      <span>
        {message.body || message.text || ''}
      </span>
    </div>
  )
}

export default MessageItem
