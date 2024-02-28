import React from 'react';


const OperatoreNav = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Anti Piracy Platform</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                               aria-expanded="false">
                                Operazioni
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Visualizza richieste da confermare</a></li>
                                <li><a className="dropdown-item" href="#">Visualizza richieste già confermate</a></li>

                            </ul>
                        </li>
                    </ul>
                    <span className="navbar-text">
                            <a className="nav-link" href="./logout">Logout</a>
                    </span>

                </div>
            </div>
        </nav>
    );
}

export default OperatoreNav;
