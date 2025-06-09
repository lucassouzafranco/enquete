from dataclasses import dataclass
from datetime import datetime

@dataclass
class Voto:
    type: str
    object: str
    valor: int
    datetime: int

    def to_dict(self):
        return {
            "type": self.type,
            "object": self.object,
            "valor": self.valor,
            "datetime": self.datetime,
        }
