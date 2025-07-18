source "$(dirname "$0")/../vdelo.local"

curl $HOST/api/stocks/dsur \
    -X GET \
    -H "access: $ACCESS" \
    -H "profile: $PROFILE" \
