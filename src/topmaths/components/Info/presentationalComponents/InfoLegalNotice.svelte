<script lang="ts">
  import { goToView } from '../../../services/navigation'
  import AnchorExternal from '../../shared/AnchorExternal.svelte'
</script>

<h1>MENTIONS LÉGALES</h1>
<h2>IDENTITÉ</h2>
<p>
  <b>Nom du site Web :</b> topmaths<br />
  <b>Adresse :</b> https://topmaths.fr<br />
  <b>Propriétaire :</b> Guillaume VALMONT<br />
  <b>Responsable de publication :</b> Guillaume VALMONT<br />
  <b>Conception et réalisation :</b> Guillaume VALMONT<br />
  <b>Hébergement :</b> o2switch - Chemin des Pardiaux - 63000 Clermont-Ferrand
</p>
<h2>INFORMATIONS</h2>
<p>
  Les informations et documents du site sont présentés à titre indicatif, n’ont
  pas de caractère exhaustif et ne peuvent engager la responsabilité du
  propriétaire du site.
  <br /><br />
  Le propriétaire du site ne peut être tenu responsable des dommages directs et indirects
  consécutifs à l’accès au site.
</p>
<h2>PROPRIÉTÉ INTELLECTUELLE</h2>
<p>
  Le contenu du site est sous licence
  <AnchorExternal href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">
    CC-BY-SA 4.0
  </AnchorExternal>
  .<br />
  Le
  <AnchorExternal
    href="https://forge.apps.education.fr/valmontguillaume/topmaths"
  >
    code source du site
  </AnchorExternal>
  est sous licence
  <AnchorExternal href="https://www.gnu.org/licenses/agpl-3.0.html">
    AGPL 3.0
  </AnchorExternal>
  .
</p>
<h2>LIENS</h2>
<p>
  Le propriétaire du site décline toute responsabilité et n’est pas engagé par
  le référencement via des liens hypertextes, de ressources tierces présentes
  sur Internet, tant en ce qui concerne leur contenu que leur pertinence.
  <br /><br />
  Le propriétaire du site autorise les liens hypertextes vers l’une des pages de ce
  site, à condition que ceux-ci ouvrent une nouvelle fenêtre et soient présentés de
  manière non équivoque afin d’éviter tout risque de confusion entre le site citant
  et le propriétaire du site ainsi que toute présentation tendancieuse, ou contraire
  aux lois en vigueur.
  <br /><br />
  Le propriétaire du site se réserve le droit de demander la suppression d’un lien
  s’il estime que le site source ne respecte pas les règles ainsi définies.
</p>
<h2>CONFIDENTIALITÉ</h2>
<p>
  Le site ne recueille pas d’informations personnelles et n’est pas assujetti à
  déclaration à la CNIL.
  <br />
  Voir également la page
  <button
    class="is-topmaths is-interactive"
    on:click={(event) => goToView(event, 'info', 'privacy-policy')}
  >
    Politique de confidentialité
  </button>
  .
</p>
