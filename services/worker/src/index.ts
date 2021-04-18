import 'reflect-metadata';
import { handleFatalError, runApp } from './app';

runApp().catch(handleFatalError)