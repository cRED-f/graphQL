import { useQuery, gql } from "@apollo/client";

const query = gql`
  query GetTodo {
    getTodo {
      id
      title
      completed
      user {
        id
        name
        username
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) return <h1>loading...</h1>;

  return (
    <>
      {" "}
      <div> {JSON.stringify(data)}</div>
    </>
  );
}

export default App;
