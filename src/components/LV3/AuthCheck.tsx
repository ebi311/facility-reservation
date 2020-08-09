// import React, { ReactNode, useEffect, useState } from 'react';
// import { RouteComponentProps, useHistory } from 'react-router';
// import { getCurrentUser } from '../../auth';
// import { setAgent } from '../../controllers/agent';

// const AuthCheck: React.FC<RouteComponentProps> = props => {
//   const history = useHistory();
//   const [component, setComponent] = useState<ReactNode | undefined>(null);
//   useEffect(() => {
//     const user = getCurrentUser();
//     const { pathname, hash, search } = props.location;
//     const originUrl = `${pathname}${hash}${search}`;
//     const loginUrl = '/login?prev=' + encodeURIComponent(originUrl);
//     if (!user) {
//       history.push(loginUrl);
//       return;
//     }
//     user
//       .getIdToken()
//       .then(id => {
//         setAgent(id);
//         setComponent(props.children);
//       })
//       .catch(() => history.push(loginUrl));
//   }, [history, props.children, props.location]);
//   return <>{component || <p>Loading...</p>}</>;
// };

// export default AuthCheck;
