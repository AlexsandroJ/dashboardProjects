import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons'; // Importando os ícones
import { UserCircleIcon } from '@heroicons/react/24/solid';

const Header = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false); // Estado para controlar a visibilidade da barra de busca

    return (
        <header className="flex items-center justify-between lg:px-30 bm:px-6 bg-[#387478] text-white h-30">
           

            {/* Barra de Pesquisa */}
            <div className='flex-grow mx-4 flex   '>
                <div className="relative flex items-center w-full">
                    <input
                        type="text"
                        placeholder="Pesquisar"
                        className="w-full px-4 py-2 rounded-md bg-[#f0e6d2] text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <FontAwesomeIcon
                        icon={faSearch} // Ícone de pesquisa dentro da barra de busca
                        className="absolute right-0 mr-2 hover:text-yellow-400 text-black cursor-pointer h-4 w-4"
                        //onClick={() => setIsSearchVisible(false)} // Oculta a barra de busca quando clicado
                    />
                </div>
            </div>

            {/* Ícone de Perfil */}
            <div className="flex-shrink-0">
                <UserCircleIcon className="w-20  hover:text-yellow-400" />
            </div>
        </header>
    );
};

export default Header;