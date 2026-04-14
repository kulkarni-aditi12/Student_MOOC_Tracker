import type { User } from '../types';
import { getUsers, saveUser, setSession, clearSession, generateId } from './storage';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export function login(email: string, password: string): AuthResult {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  setSession(user.id, user.role);
  return { success: true, user };
}

export function signup(name: string, email: string, password: string, role: 'student' | 'instructor'): AuthResult {
  const users = getUsers();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'An account with this email already exists' };
  }
  const newUser: User = {
    id: generateId(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    joinedAt: new Date().toISOString(),
  };
  saveUser(newUser);
  setSession(newUser.id, newUser.role);
  return { success: true, user: newUser };
}

export function logout(): void {
  clearSession();
}
