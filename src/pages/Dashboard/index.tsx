import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import {
  Title, Form, Repositories, Error,PaginationContainer,
  PaginationButton
} from './styles';

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
  const [inputError, setInputError] = useState('');
  const [page, setPage] = useState(1);
  const [isSearch, setIsSearch] = useState(false);

  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

    if (storageRepositories) {
      return JSON.parse(storageRepositories);
    }
    return [];
  });

  //dispara quando tem modança na variavel
  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  const handleAddRepository = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositorio');
      return;
    }

    try {
      const response = await api.get(`/search/repositories?q=${newRepo}&sort=stars&per_page=40&page=${page}`);
      const { items, total_count } = response.data;

      const repository = items

      setRepositories([ ...repository]);
      // setNewRepo('');
      if(total_count > 40){
        setIsSearch(true);
      }
      setInputError('');

    } catch (err) {
      setInputError('Erro na busca por esse repositório');
      setIsSearch(false);
    }

    //adição de um novo repositorio
    //consumir a api do github
    //salvar novo repositorio no estado
  }, [newRepo, page]);

  const loadMore = useCallback(async () => {
    try {
      const response = await api.get(`/search/repositories?q=${newRepo}&sort=stars&per_page=40&page=${page}`);
      const { items } = response.data;

      const repository = items

      setRepositories([...repository]);
      // setNewRepo('');
      setInputError('');

    } catch (err) {
      setInputError('Erro na busca por esse repositório');
    }
  }, [page, newRepo]);



  return (
      <>
          <img src={logoImg} alt="Github Explorer" />

          <Title>Explore repositórios no Github</Title>

          <Form hasError={!!inputError} onSubmit={handleAddRepository}>
              <input
                value={newRepo}
                onChange={(e) => setNewRepo(e.target.value)}
                placeholder="Digite o nome do repositorio"
              />
              <button type="submit">Pesquisar</button>
          </Form>

          { inputError && <Error>{inputError}</Error> }
          {/* fazer paginação */}

          {isSearch && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => {
                  setPage(page - 1)
                  loadMore()
                }}
                disabled={page === 1}
              >
                <FiChevronLeft size={20} />
                Anterior
              </PaginationButton>
              <PaginationButton
                disabled={page === 25}
                onClick={() => {
                  setPage(page + 1)
                  loadMore()
                }}
              >
                Próximo
                <FiChevronRight size={20} />
              </PaginationButton>
            </PaginationContainer>
          )}
          <Repositories>
            {repositories.map((repository) => (
              <Link to={`/repository/${repository.full_name}`} key={repository.full_name}>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
            ))}
          </Repositories>
      </>
  );
};

export default Dashboard;
