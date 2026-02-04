async function enviarScript(scriptText){
    // Divide o texto em linhas e limpa espaços vazios
    const lines = scriptText.split(/[\n\t]+/).map(line => line.trim()).filter(line => line);
    
    // Seleciona o campo de entrada (usando o seletor que funcionou no seu teste)
    // O WhatsApp costuma ter dois campos com esse role: [0] é a busca, [1] é o chat.
    const campos = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
    const textarea = campos[1] || campos[0];
    
    if(!textarea) throw new Error("Não há uma conversa aberta ou o campo de texto não foi encontrado");
    
    for(const line of lines){
        console.log("Enviando:", line);
    
        textarea.focus();
        document.execCommand('insertText', false, line);
        textarea.dispatchEvent(new Event('change', {bubbles: true}));
    
        // Aguarda um pequeno delay para o botão de enviar aparecer/ser processado
        await new Promise(resolve => setTimeout(resolve, 150));

        // Busca o botão de enviar por data-testid, ícone ou label de acessibilidade
        const sendBtn = document.querySelector('[data-testid="send"]') || 
                        document.querySelector('[data-icon="send"]') || 
                        document.querySelector('button[aria-label="Enviar"]');

        if (sendBtn) {
            sendBtn.click();
        } else {
            // Fallback: pressiona Enter caso o botão não seja encontrado
            textarea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            }));
        }
        
        // Delay entre mensagens para evitar bloqueio por spam (250ms é o padrão do script original)
        if(lines.indexOf(line) !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 5));
        }
    }
    
    return lines.length;
}

enviarScript(`
Oi amor! ❤️
Parei um pouco o trabalho aqui para pensar na gente...
E resolvi listar algumas coisas:
Eu amo o seu sorriso logo cedo.
Amo o jeito que você me apoia em tudo.
Amo a nossa parceria, mesmo nos dias difíceis.
Você é a melhor parte do meu dia.
Obrigado por ser minha esposa e minha melhor amiga.
Te amo daqui até o infinito!
🌹🌹🌹
`).then(e => console.log(`Surpresa enviada! ${e} mensagens entregues.`)).catch(console.error)