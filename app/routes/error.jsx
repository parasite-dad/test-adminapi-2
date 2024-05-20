// import { useRouteError } from "@remix-run/react";
// export default function ErrorPage() {
//   const error = useRouteError();
//   console.error(error);

//   return (
//     <div id="error-page">
//       <h1>Oops!</h1>
//       <p>Sorry, an unexpected error has occurred.</p>
//       <p>
//         <i>{error?.status && error.status}</i>
//         <i>{error?.message && error.message}</i>
//       </p>
//     </div>
//   );
// }

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export default function ErrorPage() {
  const error = useRouteError();
  console.log("errorpage");
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
