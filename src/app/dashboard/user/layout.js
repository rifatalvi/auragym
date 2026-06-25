import { RequireRole } from '@/lib/cors/session';
import React from 'react';

const TrainerPage = async ({children}) => {
     await RequireRole(`user`);
    return children
};

export default TrainerPage;