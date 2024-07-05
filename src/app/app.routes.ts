import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo:"/websocket/users",
        pathMatch: 'full',
    },
    {
        path: "websocket",
        loadComponent: () =>
          import('./Components/lyout/lyout.component').then(
            m => m.LyoutComponent
          ),
          children: [
            {
                path: "users",
                loadComponent: () =>
                  import('./Components/user/user.component').then(
                    m => m.UserComponent
                  ),
            },
            {
                path: "posts",
                loadComponent: () =>
                  import('./Components/post/post.component').then(
                    m => m.PostComponent
                  ),
            },
            {
                path: "inbox",
                loadComponent: () =>
                  import('./Components/message/message.component').then(
                    m => m.MessageComponent
                  ),
            },
          ]
    },
    {
        path: "login",
        loadComponent: () =>
          import('./Components/login/login.component').then(
            m => m.LoginComponent
          ),
    },
    

    {
        path: '**',
        loadComponent: () =>
            import('./Components/not-found/not-found.component').then(
                m => m.NotFoundComponent
            ),
    },
];
