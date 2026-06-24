import React from 'react';

const TrainerPage = async ({children}) => {
     await RequireRole("trainer");
    return children
};

export default TrainerPage;