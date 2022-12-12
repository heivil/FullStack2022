import { render, screen, fireEvent} from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import axios from 'axios';

jest.mock('axios');

describe('App', () => {
  it('renderöi sovelluksen consoliin', async () => {
    
    const tentti = { ten_nimi: "Tentti", kysymykset: [{ kys_nimi: "Kysymys", id: 0, vastaukset: [{ vas_nimi: "Vastaus 1", kysymys_id: 0 }] }], maxPisteet: 2, minPisteet: 1 }
    //const tentit = {tenttejä: 1, tenttiLista:[tentti]}
    render(<App />);
    const lisääNappi = screen.getByRole('button', {
      name: 'Lisää tentti'
    })

    await userEvent.click(lisääNappi);
    
    screen.debug

/*     axios.get.mockImplementationOnce(() =>
      Promise.resolve({ tentti })
    );

    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ tentit })
    );

    dispatch({ type: 'ALUSTA_DATA', payload: { tentti: tentti, tentit: tentit } })

   

    await userEvent.click(screen.getByRole('button')); */


    screen.debug();
    
  })
})

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