import { Routes } from '@angular/router';
import { MenuGuard } from './Services/menu.guard';
import { EditGuard } from './Services/edit.guard';
import { ROUTES_CONSTANTS } from '../assets/utils/constants/routes.constant';

export const routes: Routes = [
    {
        path: '',
        redirectTo:"/login",
        pathMatch: 'full',
    },
    {
        path: "lyout",
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
                canActivate: [MenuGuard]  // Appliquer le guard ici
            },
            {
                path: "posts",
                loadComponent: () =>
                  import('./Components/post/post.component').then(
                    m => m.PostComponent
                  ),
                canActivate: [MenuGuard]  // Appliquer le guard ici
            },
            {
                path: "inbox",
                loadComponent: () =>
                  import('./Components/message/message.component').then(
                    m => m.MessageComponent
                  ),
                canActivate: [MenuGuard]  // Appliquer le guard ici
            },
            {
              path: "profiles",
              loadComponent: () =>
                import('./Components/profile/profile.component').then(
                  m => m.ProfileComponent
                ),
              canActivate: [MenuGuard]  // Appliquer le guard ici
            },
            {
              path: "profiles/:id",
              loadComponent: () =>
                import('./Components/profile-edition/profile-edition.component').then(
                  m => m.ProfileEditionComponent
                ),
              canActivate: [EditGuard],
              data: { requiredMenuUrl: ROUTES_CONSTANTS.PROFILES }  // Passer l'URL de base comme donnée
            },
            {
              path: "menus",
              loadComponent: () =>
                import('./Components/menu/menu.component').then(
                  m => m.MenuComponent
                ),
              canActivate: [MenuGuard]  // Appliquer le guard ici
            },
            {
              path: "menus/select/:id",
              loadComponent: () =>
                import('./Components/menu/menu.component').then(
                  m => m.MenuComponent
                ),
                canActivate: [EditGuard],
                data: { requiredMenuUrl: ROUTES_CONSTANTS.PROFILES }  // Passer l'URL de base comme donnée
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
