package com.drreddysdirect;

import android.util.Log;
import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import java.security.cert.CertificateException;
import java.util.concurrent.TimeUnit;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.CertificatePinner;
import okhttp3.OkHttpClient;
import okhttp3.Request;

public class CustomOkHttp implements OkHttpClientFactory {

    //jdvUl3zIGbE7dzPLMIoBuGUaVe1Xx2HC01XWWibMzsw= //Stage jdvUl3zIGbE7dzPLMIoBuGUaVe1Xx2HC01XWWibMzsw=
    //3JJ+CZCQkkGCSKk8ZoUMZY43C+1g+22icwG2rTm/2qQ= //Production
    //n5F7pCV8iZyTYuE6wcW00UXJ/TN8GZ/JPBdg189mG/8= //integration

    //mcstaging.drreddysdirect.com

    private static final String TAG = "OkHttpClientFactory";
    @Override
    public OkHttpClient createNewNetworkModuleClient() {
        try {
            // Create a trust manager that does not validate certificate chains
//            final TrustManager[] trustAllCerts = new TrustManager[]{
//                    new X509TrustManager() {
//                        @Override
//                        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
//                        }
//
//                        @Override
//                        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws CertificateException {
//                        }
//
//                        @Override
//                        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
//                            return new java.security.cert.X509Certificate[]{};
//                        }
//                    }
//            };
//
//            // Install the all-trusting trust manager
//            final SSLContext sslContext = SSLContext.getInstance("SSL");
//            sslContext.init(null, trustAllCerts, new java.security.SecureRandom());
//            // Create an ssl socket factory with our all-trusting manager
//            final SSLSocketFactory sslSocketFactory = sslContext.getSocketFactory();



//            OkHttpClient.Builder builder = new OkHttpClient.Builder()
//                    .certificatePinner(new CertificatePinner.Builder()
//                           // .add("mcstaging.drreddysdirect.com", "sha256/jdvUl3zIGbE7dzPLMIoBuGUaVe1Xx2HC01XWWibMzsw=")
//                            //.add("integration2-hohc4oi-httkvouonnnki.us-5.magentosite.cloud", "sha256/n5F7pCV8iZyTYuE6wcW00UXJ/TN8GZ/JPBdg189mG/8=")
//
//                            //.add("mcstaging.drreddysdirect.com", "sha1/3JJ+CZCQkkGCSKk8ZoUMZY43C+1g+22icwG2rTm/2qQ=")
////
//                            .build())
//                    .connectTimeout(0, TimeUnit.MILLISECONDS).readTimeout(0, TimeUnit.MILLISECONDS)
//                    .writeTimeout(0, TimeUnit.MILLISECONDS).cookieJar(new ReactCookieJarContainer());
//            builder.sslSocketFactory(sslSocketFactory, (X509TrustManager) trustAllCerts[0]);
////            builder.hostnameVerifier(new HostnameVerifier() {
////                                         @Override
////                                         public boolean verify(String hostname, SSLSession session) {
////                                             return true;
////                                         }
////            });
//
//
//            OkHttpClient okHttpClient = builder.build();

 //           String hostname = "mcstaging.drreddysdirect.com";
//            CertificatePinner certificatePinner = new CertificatePinner.Builder()
//                            .add(hostname, "sha256/jdvUl3zIGbE7dzPLMIoBuGUaVe1Xx2HC01XWWibMzsw=")
//                    .build();
//            OkHttpClient okHttpClient = new OkHttpClient.Builder()
//                    .cookieJar(new ReactCookieJarContainer())
//                    .certificatePinner(certificatePinner)
//                    .build();

                       String hostname = "mcstaging.drreddysdirect.com";
            CertificatePinner certificatePinner = new CertificatePinner.Builder()
                            .add(hostname, "sha256/r/mIkG3eEpVdm+u/ko/cwxzOMo1bk4TyHIlByibiA5E=",
                                    "sha256/atD1rDM/bOFKKqPYEficCpEQMKa8ccOom9H0wlpUM9s=",
                                    "sha256/zUIraRNo+4JoAYA7ROeWjARtIoN4rIEbCpfCRQT6N6A=")
                    .build();
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .cookieJar(new ReactCookieJarContainer())
                    .certificatePinner(certificatePinner)
                    .build();


//            OkHttpClient okHttpClient = new OkHttpClient.Builder()
//                    .cookieJar(new ReactCookieJarContainer())
//                    .build();

            return okHttpClient;
        } catch (Exception e) {
            Log.e(TAG, e.getMessage());
            throw new RuntimeException(e);
        }
    }

}
