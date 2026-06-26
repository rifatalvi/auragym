import { RequireRole } from '@/lib/cors/session';
import React from 'react';

const TrainerPage = async ({children}) => {
     await RequireRole([`user`, `member`]);
    return children
};

export default TrainerPage;