import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { getServerSession } from "./auth-options";

const fetchInterceptor = new FetchInterceptor();
fetchInterceptor.apply();

fetchInterceptor.on('request', async ({ request, requestId }) => {
    const session = await getServerSession();
    if  (session?.accessToken) {
        request.headers.set('Authorization', `Bearer ${session.accessToken}`);
    }
});