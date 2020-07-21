import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import NavBar from '../components/NavBar';
import PendingPanel from '../components/PendingPanel';
import ActivePanel from '../components/ActivePanel';
// import FinishedPanel from '../components/FinishedPanel';
import DeniedPanel from '../components/DeniedPanel';
import AllPanel from '../components/AllPanel';
import makeTripPanel from '../components/makeTripPanel';

const CardPage = () =>
{
    return(
        <div>
            <LoggedInName />
            <PageTitle />
            <NavBar />
            <PendingPanel />
            <ActivePanel />
            {/* <FinishedPanel /> */}
            <DeniedPanel />
            <AllPanel />
            <makeTripPanel />
        </div>
    );
}

export default CardPage;
