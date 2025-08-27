import { useParams } from 'react-router-dom';

const ConversationPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Conversation</h1>
      <p>Conversation ID: {id}</p>
    </div>
  );
};

export default ConversationPage;