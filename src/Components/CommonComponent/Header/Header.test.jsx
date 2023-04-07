import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Switch } from "react-router-dom";
import Account from './Navtabs/Account'
import Profile from './Navtabs/Profile/Profile'
import Navbar from './Navtabs/Navbar'
import Notification from './Navtabs/Notification';

describe('Header component', () => {

  it('should display user details for Admin', () => {
    const localStorageMock = (() => {
      let store = {
       token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2Q3YTY4MjI1OWRhODRjNGI4MDFjNzkiLCJ1c2VyUm9sZSI6IkFkbWluIiwiaWF0IjoxNjc4MzU0Njg0LCJleHAiOjE2Nzg0NDEwODR9.np5-ES-_PIHdx9aOjEA59qoxlM2WIUz18MKK15oAr1o',
       role:'Admin'
      };
      return {
        getItem(key) {
          return store[key];
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        },
      };
    })();
    
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    render(
      <BrowserRouter>
        <Switch>
          <Profile/>
          <Account/>
          <Navbar/>
          <Notification/>
        </Switch>
      </BrowserRouter>
    );
  });

  it('should display user details for Distributor', () => {
    const localStorageMock = (() => {
      let store = {
       token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2Y3MmYwNDhlYTQyYjRlZGQzMTc2ODEiLCJ1c2VyUm9sZSI6IkRpc3RyaWJ1dG9yIiwiaWF0IjoxNjc4MzU2NTAyLCJleHAiOjE2Nzg0NDI5MDJ9.POkzQ9hGOH41D_HjM677poZkvqhBF0MnGVYzavh2THI',
       role:'Distributor'
      };
      return {
        getItem(key) {
          return store[key];
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        },
      };
    })();
    
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    render(
      <BrowserRouter>
        <Switch>
        <Profile/>
          <Account/>
          <Navbar/>
          <Notification/>
        </Switch>
      </BrowserRouter>
    );
  });

  it('should display user details for Contractor', () => {
    const localStorageMock = (() => {
      let store = {
       token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2M2VjNzc1MDQ0ZTY0ZmM4ZDc0YjUwMzMiLCJ1c2VyUm9sZSI6IkNvbnRyYWN0b3IiLCJpYXQiOjE2NzgzNTg1MjAsImV4cCI6MTY3ODQ0NDkyMH0.iArQ0qymzGI9oG8ekmBqOBhEQbUmeMT5p-2XhVSBDXI',
       role:'Contractor'
      };
      return {
        getItem(key) {
          return store[key];
        },
        setItem(key, value) {
          store[key] = value.toString();
        },
        clear() {
          store = {};
        },
        removeItem(key) {
          delete store[key];
        },
      };
    })();
    
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    render(
      <BrowserRouter>
        <Switch>
        <Profile/>
          <Account/>
          <Navbar/>
          <Notification/>
        </Switch>
      </BrowserRouter>
    );
  });
});

