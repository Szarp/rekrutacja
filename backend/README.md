### Seriws JakDojade in [Solvrocity](https://github.com/Solvro/rekrutacja)

#### Instalacja
Aplkacja jest skonfigurowana aby działała w środowisku [docker](https://www.docker.com/). Po przekopiowaniu repozytorium i przejściu do niego nalezy uruchomić komendę `docker build --network host .`.

#### Uruchamianie/Zatrzymywanie
Po uruchomieniu `docker build` sprawdzamy numer obrazu np. `5d5c3adf6988` i uruchamiamy:
```bash
docker run -p 3000:3000 <numer_kontenera>
```
Zatrzymywanie przy pomocy innego okna terminalowego. Przy pomocy `docker ps` sprawdzamy działające kontenery np. `zealous_stallman` lub jego numer `5d5c3adf6988`. Następnie uruchamiamy
```
docker stop <nazwa_kontenera>
lub
docker stop <numer_kontenera>
```

#### Rest API
Aplikacja uruchomi się na porcie 3000. Są otwarte następujące rzeczy:
* [/login](127.0.0.1:3000/login) - Strona logowania do aplikacji
* [/logout](127.0.0.1:3000/logout) - Wylogowanie uzytkownika
* [/signup](127.0.0.1:3000/signup) - Rejestracja uzytkownika
* [/stops](127.0.0.1:3000/stops) - Zwraca listę przystanków
* [/path](127.0.0.1:3000/path) - Zwraca dystans pomiędzy przystankami
* [/profile](127.0.0.1:3000/path) - Strona umozliwiająca zapytanie o dystans między przystankami dla zalogowanych uzytkowników
* [/api-docs](127.0.0.1:3000/api-docs) - Swagger



#### Podstawowe dane do logowania
* user: `foo` password: `123`

