import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User,UserType } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: any;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        // username="dev1"
        // password="dev123"
        return this.http.post<User>(`${environment.apiUrl}/Auth/login`, {"userName": username,"password": password})
            .pipe(map((user:any) => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(user!=null && user.data!=null)
                {
                    localStorage.setItem('userToken',JSON.stringify(user.data.token));
                    localStorage.setItem('user',JSON.stringify(user.data.userProfile));
                    localStorage.setItem('userRole',user.data.userProfile.userRole);
                    this.userSubject.next(user.data);
                }  
                return user;           
            }));
        }

    logout() {
        localStorage.removeItem('user');
        localStorage.clear();
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/User/CreateUser`, user);
    }

    getAll() {
        return this.http.get<any>(`${environment.apiUrl}/User/GetUsersList`);
    }

    getById(id: string) {        
        return this.http.get<User>(`${environment.apiUrl}/User/GetUserById?Id=${id}`);
    }

    update(id: string, params: any) {        
        params.userId=Number(id);
        return this.http.post(`${environment.apiUrl}/user/UpdateUser`, params)
            .pipe(map(x => {  
                if (id == this.userValue.userProfile.userId) {                    
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/user/DeleteUser?Id=${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                // if (id == this.userValue.userProfile.userId) {
                //     this.logout();
                // }
                return x;
            }));
    }

    active(id: string) {
        return this.http.delete(`${environment.apiUrl}/user/ActiveUser?Id=${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                // if (id == this.userValue.userProfile.userId) {
                //     this.logout();
                // }
                return x;
            }));
    }

    getAllType() {
        return this.http.get<any>(`${environment.apiUrl}/UserType/GetUserTypeList`);
    }

    updateType(id: string, params: any) {
        params.roleId=Number(id);
        return this.http.post(`${environment.apiUrl}/UserType/UpdateUserType`, params).pipe(map(x => {return x;}));
    }

    createType(userType: UserType) {
       return this.http.post(`${environment.apiUrl}/UserType/CreateUserType`, userType);
    }

    deleteType(id: string) {
        return this.http.delete(`${environment.apiUrl}/UserType/DeleteUserType?Id=${id}`).pipe(map(x => {return x;}));
    }

    getTypeById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/UserType/GetUserTypeById?Id=${id}`);
    }
}