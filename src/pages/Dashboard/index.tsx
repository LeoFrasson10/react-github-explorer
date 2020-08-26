import React, { useState, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories } from './styles';

//puxar só os que forem utilizar, não é para puxar todos
interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };

}

//functions componest (FC)

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');

  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const response = await api.get<Repository>(`repos/${newRepo}`);

    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');

    //adição de um novo repositorio
    //consumir a api do github
    //salvar novo repositorio no estado

  }

  return (
      <>
          <img src={logoImg} alt="Github Explorer" />

          <Title>Explore repositórios no Github</Title>

          <Form onSubmit={handleAddRepository}>
              <input
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder="Digite o nome do repositorio"
              />
              <button type="submit">Pesquisar</button>
          </Form>

          <Repositories>
            {repositories.map(repository=> (
              <a href="Teste" key={repository.full_name}>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </a>
            ))}
          </Repositories>
      </>
  );
};

export default Dashboard;