def validar_voto(payload: dict) -> bool:
    return (
        payload.get("type") == "votacao_api"
        and isinstance(payload.get("object"), str)
        and payload.get("valor") == 1
        and isinstance(payload.get("datetime"), int)
    )
