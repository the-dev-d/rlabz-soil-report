export const ssr = false;


export async function load({fetch}) {

    const res = await fetch('/api/marker');
    const data = await res.json();        
    const markers = data.response;

    return {
        markers
    }
}