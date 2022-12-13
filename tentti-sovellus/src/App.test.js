import { render, screen, fireEvent} from '@testing-library/react';
import App from './App';
import Tentti from './Tentti';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import axios from 'axios';

jest.mock('axios');

describe('Tenttitesti', () => {

  it('Renderöi tentin',() => {

    let tentti = { ten_nimi: "Testaustentti", kysymykset: [{ kys_nimi: "Miten menee testaus?", id: 0, vastaukset: [{ vas_nimi: "Niin ja näin", kysymys_id: 0 }] }], maxPisteet: 2, minPisteet: 1 }

    const mockFunc = jest.fn(() => {
      tentti = {ten_nimi: "Testaustentti", kysymykset: [{ kys_nimi: "Miten menee testaus?", id: 0, vastaukset: [{ vas_nimi: "Niin ja näin", kysymys_id: 0 }]}, { kys_nimi: "Toimiiko kysymyksen lisääminen?", vastaukset:[{vas_nimi: "toimii tietenkin", kysymys_id: 0}]}], maxPisteet: 2, minPisteet: 1 }
      return tentti
    });

    render(<Tentti tentti={tentti} moodi={true} dispatch={mockFunc}/>);

    expect(screen.queryByText(/Toimiiko kysymyksen lisääminen/)).toBeNull();

    const lisääKysymys = screen.getByRole('img', {
      name: 'Lisää kysymys'
    })

    expect(screen.getByText('Miten menee testaus?')).toBeInTheDocument();

    userEvent.click(lisääKysymys);

    render(<Tentti tentti={tentti} moodi={true} dispatch={mockFunc}/>);

    expect(screen.queryByText(/Toimiiko kysymyksen lisääminen/)).toBeInTheDocument();

    screen.debug();

  })
})



/*   it('renderöi sovelluksen consoliin', () => {
    
    //const tentit = {tenttejä: 1, tenttiLista:[tentti]}
    render(<App />);

    screen.debug
    
    const lisääNappi = screen.getByRole('button', {
      name: 'Lisää tentti'
    })

    userEvent.click(lisääNappi);
    
    screen.debug

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ tentti })
    );

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ tentit })
    );

    dispatch({ type: 'ALUSTA_DATA', payload: { tentti: tentti, tentit: tentit } })

   

    await userEvent.click(screen.getByRole('button'));


    screen.debug();
    
  }) */



/* const tunnusKenttä = screen.getByRole('textbox', {
      name: 'Käyttäjätunnus:',
      value: 'pentti'
    })

    const salasanaKenttä = screen.getByRole('textbox', {
      name: 'Salasana:',
      value: 'pentti'
    })

    const kirjauduNappi = screen.getByRole('button', {
      name: 'Kirjaudu sisään'
    })

    userEvent.type(tunnusKenttä, 'ville');

    userEvent.type(salasanaKenttä, 'ville');

    fireEvent.change(screen.getAllByRole('textbox'), {
      target: { value: 'JavaScript' },
    });

    screen.debug(); */ 