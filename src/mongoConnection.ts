import mongoose from 'mongoose';

import config from './config';

export default (): void => {
   let password: string = config.databasePassword ?? '';

   const DB: string = config.database?.replace('<password>', password) ?? '';

   mongoose.connect(DB).then(() => console.log('DB connection Successfully'));
};
