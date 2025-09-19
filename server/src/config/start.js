
import figlet from 'figlet';

export const displayStartupMessage = () => {
    figlet('Sweet Shop', (err, data) => {
        if (err) {
            console.error('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(data);
        console.log('Server is starting...');
    });
};
    