import { FC, useEffect, useState } from 'react';
import { MercadoPago } from './protocols/mercadopago';

const PUBLIC_KEY = 'TEST-72e36eae-b4c8-4231-9e32-ab1799af592f';
const locale = '';

interface OptionsProps {
    label: string;
    value: string;
}


export const Payment: FC = () => {
    const [mercadopago, setMercadopago] = useState<MercadoPago | null>();
    const [identificationTypeOptions, setIdentificationTypeOptions] = useState<OptionsProps[]>([]);
    const [months, setMonths] = useState<OptionsProps[]>([]);
    const [years, setYears] = useState<OptionsProps[]>([]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.mercadopago.com/js/v2';

        script.addEventListener('load', () => {
            setMercadopago(new window.MercadoPago(PUBLIC_KEY, { locale, advancedFraudPrevention: true }));
        });

        document.body.appendChild(script);

        return () => {
            let iframe = document.body.querySelector('iframe[src*="mercadolibre"]');

            if (iframe) {
                document.body.removeChild(iframe);
            }

            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (mercadopago) {
            getIdentificationTypes();
            getExpirationMonth();
            getExpirationYears();
        }
    }, [mercadopago]);

    //Start mover este codigo
    const getIdentificationTypes = async() => {
        if (mercadopago) {
            const identificationTypes = await mercadopago.getIdentificationTypes().then((response) => response.map((type) => ({ label: type.name, value: type.id })));
            setIdentificationTypeOptions(identificationTypes);
        }
    }

    const getExpirationMonth = () => {
        const items = new Array(12).fill(true).map((_, index) => ({
            label: String(index + 1).padStart(2, '0'),
            value: String(index + 1).padStart(2, '0')
        }));
        setMonths(items);
    }

    const getExpirationYears = () => {
        const currentYear = new Date().getFullYear();
        const items = new Array(16).fill(true).map((_, index) => ({
            label: String(currentYear + index),
            value: String(currentYear + index)
        }));
        setYears(items);
    }

    //End mover este codigo

    const createToken = async() => {
        if (mercadopago) {
            const response = await mercadopago.createCardToken({
                cardNumber: '4009175332806176',
                cardholderName: 'Pepe Vergalarga',
                cardExpirationMonth: '11',
                cardExpirationYear: '2025',
                securityCode: '123',
                identificationType: 'DNI',
                identificationNumber: '12345678'
            });

            console.log('respuesta', response);
        }
    }


    return (
       <>
        <div>MercadoPago</div>
        <button onClick={createToken}> ENVIAR </button>
       </>
    )
}
