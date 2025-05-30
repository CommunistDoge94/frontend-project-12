const MessageItem = ({ message }) => {
  return (
    <div className="mb-2">
      <b className="me-1">
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
