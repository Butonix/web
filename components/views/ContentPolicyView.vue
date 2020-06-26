<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div class="headline">Content Policy</div>
        <div class="subtitle-1">
          Comet allows free speech, but there are still some rules we have to
          follow.
        </div>
        <ol>
          <li>
            <span class="font-weight-bold">Follow U.S. law.</span> Posts that
            break United States law are not allowed. This includes but is not
            limited to:
            <ul>
              <li>Copyright law</li>
              <li>
                No selling/distribution of drugs or other illegal substances
              </li>
              <li>
                Do not incite, threaten, or glorify violence or other unlawful
                behavior
              </li>
            </ul>
          </li>
          <li>
            <span class="font-weight-bold">No spam.</span>
          </li>
          <li>
            <span class="font-weight-bold">No malicious content.</span>
            <ul>
              <li>
                Posts that link to phishing, viruses, etc. are not allowed.
              </li>
              <li>
                Posts that intentionally break or cause bugs on Comet are not
                allowed.
              </li>
              <li>
                <span class="font-weight-bold">URL shorteners</span> are not
                allowed. Comet and its users must be able to see exactly what
                link they are following.
              </li>
            </ul>
          </li>
          <li>
            <span class="font-weight-bold"
              >No doxxing, impersonation, or threatening users.</span
            >
          </li>
          <li>
            <span class="font-weight-bold"
              >Do not share Comet security vulnerabilities.</span
            >
            For the safety of Comet users, please report any security
            vulnerabilities that you find directly to Dan#7457 on
            <a href="https://discord.gg/NPCMGSm">Discord</a>.
          </li>
          <li>
            <span class="font-weight-bold">No pornography.</span> Pornographic
            content does not have a role in our mission of being a platform for
            interesting, productive dicussion. Non-pornographic nudity (i.e.
            art) is allowed.
          </li>
        </ol>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ContentPolicyView'
}
</script>

<style scoped></style>
