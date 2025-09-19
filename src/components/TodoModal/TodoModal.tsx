import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { User } from '../../types/User';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { getUser } from '../../api';
import { currentTodoSlice } from '../../features/currentTodo';
import classNames from 'classnames';

export const TodoModal: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const currTodo = useAppSelector((state: RootState) => state.currentTodo);

  useEffect(() => {
    if (currTodo) {
      getUser(currTodo.userId)
        .then(userFromServer => {
          setCurrentUser(userFromServer);
        })
        .catch(e => {
          throw new Error(e);
        })
        .finally(() => setIsLoading(false));
    }
  }, [currTodo]);

  if (isLoading) {
    return (
      <div className="modal is-active" data-cy="modal">
        <div className="modal-background" />
        <Loader />
      </div>
    );
  }

  return (
    <>
      {currTodo && (
        <div className="modal is-active" data-cy="modal">
          <div className="modal-background" />

          <div className="modal-card">
            <header className="modal-card-head">
              <div
                className="modal-card-title has-text-weight-medium"
                data-cy="modal-header"
              >
                {`Todo #${currTodo.id}`}
              </div>

              {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
              <button
                type="button"
                className="delete"
                data-cy="modal-close"
                onClick={() =>
                  dispatch(currentTodoSlice.actions.clearCurrentTodo())
                }
              />
            </header>

            <div className="modal-card-body">
              <p className="block" data-cy="modal-title">
                {currTodo.title}
              </p>

              <p className="block" data-cy="modal-user">
                {/* For not completed */}
                <strong
                  className={classNames({
                    'has-text-danger': !currTodo.completed,
                    'has-text-success': currTodo.completed,
                  })}
                >
                  {currTodo.completed ? 'Done' : 'Planned'}
                </strong>
                {' by '}
                <a href={`mailto:${currentUser?.email}`}>{currentUser?.name}</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
